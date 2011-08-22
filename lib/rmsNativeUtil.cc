// vim: set sw=2 ts=2:

/**
 * @fileoverview RMS Native utilities.
 * @author yyfrankyy@gmail.com (Frank Xu)
 */

#include <v8.h>
#include <node.h>

using namespace node;
using namespace v8;

class RMSNativeUtil: ObjectWrap
{
    private:
        int m_count;

    public:
        static Persistent<FunctionTemplate> s_ct;
        static void Init(Handle<Object> target)
        {
            HandleScope scope;

            /*
            Local<FunctionTemplate> t = FunctionTemplate::New(New);

            s_ct = Persistent<FunctionTemplate>::New(t);
            s_ct->InstanceTemplate()->SetInternalFieldCount(1);
            s_ct->SetClassName(String::NewSymbol("RMSNativeUtil"));

            NODE_SET_PROTOTYPE_METHOD(s_ct, "forceGC", ForceGC);

            target->Set(String::NewSymbol("RMSNativeUtil"),
                        s_ct->GetFunction());
            */
            NODE_SET_METHOD(target, "forceGC", ForceGC);

        }

        RMSNativeUtil() :
            m_count(0)
        {
        }

        ~RMSNativeUtil()
        {
        }

        // support for new operator
        static Handle<Value> New(const Arguments& args)
        {
            HandleScope scope;
            RMSNativeUtil* rnu = new RMSNativeUtil();
            rnu->Wrap(args.This());
            return args.This();
        }

        static Handle<Value> ForceGC(const Arguments& args)
        {
            HandleScope scope;
            // RMSNativeUtil* rnu = ObjectWrap::Unwrap<RMSNativeUtil>(args.This());
            // rnu->m_count++;
            V8::LowMemoryNotification();
            return Undefined();
        }

};

Persistent<FunctionTemplate> RMSNativeUtil::s_ct;

extern "C" {
    static void init (Handle<Object> target)
    {
        RMSNativeUtil::Init(target);
    }

    NODE_MODULE(rmsNativeUtil, init);
}
